import { ContactItem, ContactItemSchema } from "./schemas";

export const contactsData: ContactItem[] = [
  ContactItemSchema.parse({
    id: "contact-email",
    verification: "VERIFIED",
    position: 0,
    type: "email",
    label: "Direct Email",
    displayText: "budikusumafauzi@gmail.com",
    href: "mailto:budikusumafauzi@gmail.com",
    approvedForPublic: true,
  }),
  ContactItemSchema.parse({
    id: "contact-linkedin",
    verification: "VERIFIED",
    position: 1,
    type: "linkedin",
    label: "LinkedIn Profile",
    displayText: "linkedin.com/in/fauzi-budikusuma",
    href: "https://www.linkedin.com/in/fauzi-budikusuma",
    approvedForPublic: true,
  }),
  ContactItemSchema.parse({
    id: "contact-github",
    verification: "VERIFIED",
    position: 2,
    type: "github",
    label: "GitHub Repositories",
    displayText: "github.com/budikusumafauzi-sketch",
    href: "https://github.com/budikusumafauzi-sketch",
    approvedForPublic: true,
  }),
  ContactItemSchema.parse({
    id: "contact-instagram",
    verification: "VERIFIED",
    position: 3,
    type: "instagram",
    label: "Instagram Activity",
    displayText: "@budikusuma._fauzi",
    href: "https://www.instagram.com/budikusuma._fauzi",
    approvedForPublic: true,
  }),
];
