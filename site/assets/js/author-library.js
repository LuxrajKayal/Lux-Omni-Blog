// Luxraj Author Library — development test records.
// Replace these records with approved author details when the author profiles are ready.
export const AUTHORS = Object.freeze([
  Object.freeze({
    id: "author-alpha-tester",
    name: "Alpha Tester",
    description: "Website tester for desktop",
    website: "https://example.com",
    image: "assets/images/brand/luxraj-blog-transparent-symbol.svg"
  }),
  Object.freeze({
    id: "author-beta-tester",
    name: "Beta Tester",
    description: "Website tester for mobile",
    website: "https://example.com",
    image: "assets/images/brand/luxraj-blog-transparent-symbol.svg"
  }),
  Object.freeze({
    // Temporary sample record for the author-bar pilot.
    // Replace the sample photograph and confirm the author-page route before launch.
    id: "author-luxraj-kayal",
    name: "Luxraj Kayal",
    handle: "@Luxraj_Kayal",
    profileUrl: "authors/luxraj-kayal/",
    image: "assets/images/authors/luxraj-author-sample.webp"
  })
]);

export const AUTHORS_BY_ID = Object.freeze(
  Object.fromEntries(AUTHORS.map(author => [author.id, author]))
);
