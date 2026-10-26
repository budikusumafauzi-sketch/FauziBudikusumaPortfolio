/**
 * scripts/mock-gemini-faults.mjs
 * Test-only mock Gemini server implementing all fault modes specified in CR-014 Item 26.
 *
 * Fault modes supported:
 * - healthy
 * - delay-3s (exceeds 2.0s soft deadline, triggers hedge attempt)
 * - delay-10s (exceeds 4.0s hard AI budget, client aborts to degraded)
 * - hang-forever (connection held open indefinitely until client aborts)
 * - error-429 (ResourceExhausted / Quota exceeded)
 * - error-500 (Internal server error)
 * - error-503 (Service unavailable / Overloaded model)
 * - error-504 (Deadline exceeded gateway timeout)
 * - conn-reset (Immediate socket destruction)
 * - tls-close (Immediate connection end)
 * - truncated-json (Malformed incomplete JSON string)
 * - empty-body (HTTP 200 with empty body)
 * - invalid-schema (JSON output violating grounding schema)
 * - wrong-citations (JSON with invalid / hallucinated citation IDs)
 */

import http from 'http';

const PORT = parseInt(process.env.MOCK_PORT || '9876', 10);
let currentFaultMode = 'healthy';
let requestStats = {
  total: 0,
  byMode: {},
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  // Control endpoints
  if (url.pathname === '/set-fault') {
    const newMode = url.searchParams.get('mode') || 'healthy';
    currentFaultMode = newMode;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, activeMode: currentFaultMode }));
    return;
  }

  if (url.pathname === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ activeMode: currentFaultMode, stats: requestStats }));
    return;
  }

  if (url.pathname === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ok');
    return;
  }

  // Handle Gemini SDK requests
  requestStats.total += 1;
  const activeMode = req.headers['x-mock-fault'] || currentFaultMode;
  requestStats.byMode[activeMode] = (requestStats.byMode[activeMode] || 0) + 1;

  // Drain request body to prevent socket stalls
  req.on('data', () => {});

  req.on('end', async () => {
    switch (activeMode) {
      case 'delay-3s': {
        // Exceeds 2.0s soft deadline: triggers Attempt 2 hedge
        await new Promise((r) => setTimeout(r, 3000));
        sendHealthyResponse(res);
        break;
      }

      case 'delay-10s': {
        // Exceeds 4.0s hard deadline: client aborts, falls back to degraded
        await new Promise((r) => setTimeout(r, 10000));
        sendHealthyResponse(res);
        break;
      }

      case 'hang-forever': {
        // Do not respond; client must abort at 4.0s hard deadline
        break;
      }

      case 'error-429': {
        res.writeHead(429, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            error: {
              code: 429,
              message: 'Resource exhausted: quota exceeded for model',
              status: 'RESOURCE_EXHAUSTED',
            },
          }),
        );
        break;
      }

      case 'error-500': {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            error: {
              code: 500,
              message: 'Internal server error in model compute backend',
              status: 'INTERNAL',
            },
          }),
        );
        break;
      }

      case 'error-503': {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            error: {
              code: 503,
              message: 'The model is overloaded. Please try again later.',
              status: 'UNAVAILABLE',
            },
          }),
        );
        break;
      }

      case 'error-504': {
        res.writeHead(504, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            error: {
              code: 504,
              message: 'Gateway deadline exceeded',
              status: 'DEADLINE_EXCEEDED',
            },
          }),
        );
        break;
      }

      case 'conn-reset': {
        req.socket.destroy();
        break;
      }

      case 'tls-close': {
        req.socket.end();
        break;
      }

      case 'truncated-json': {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{"candidates":[{"content":{"parts":[{"text":"{\\"kind\\":\\"answer\\",\\"answer\\":\\"Fauzi is a software dev');
        break;
      }

      case 'empty-body': {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('');
        break;
      }

      case 'invalid-schema': {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            candidates: [
              {
                content: {
                  parts: [
                    {
                      text: JSON.stringify({
                        unexpectedKey: 'random data',
                        missingAnswerField: true,
                      }),
                    },
                  ],
                },
                finishReason: 'STOP',
              },
            ],
          }),
        );
        break;
      }

      case 'wrong-citations': {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            candidates: [
              {
                content: {
                  parts: [
                    {
                      text: JSON.stringify({
                        kind: 'answer',
                        answer: 'Fauzi holds several certifications.',
                        citations: ['hallucinated:nonexistent:id', 'fake:record:999'],
                      }),
                    },
                  ],
                },
                finishReason: 'STOP',
              },
            ],
          }),
        );
        break;
      }

      case 'healthy':
      default: {
        sendHealthyResponse(res);
        break;
      }
    }
  });
});

function sendHealthyResponse(res) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      candidates: [
        {
          content: {
            parts: [
              {
                text: JSON.stringify({
                  kind: 'answer',
                  answer:
                    'Fauzi Budikusuma is a Software Development & Network Engineer with 35 verified technical competencies and official public-sector internship experience.',
                  citations: ['profile:main', 'experience:kominfo'],
                }),
              },
            ],
          },
          finishReason: 'STOP',
        },
      ],
    }),
  );
}

server.listen(PORT, () => {
  console.log(`[MOCK GEMINI] Server running on port ${PORT} (mode: ${currentFaultMode})`);
});
