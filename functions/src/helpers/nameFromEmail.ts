/**
 * Get the username from an email address.
 * E.g. 'elon@gmail.com' returns 'elon'.
 */
export function getNameFromEmail(email: string): string {
  if (email.lastIndexOf('@') === -1) {
    return email;
  }

  return email.substring(0, email.lastIndexOf('@'));
}
