export function getProtectedRouteDestination(
  token: string | null,
): string | null {
  return token === null ? "/login" : null;
}
