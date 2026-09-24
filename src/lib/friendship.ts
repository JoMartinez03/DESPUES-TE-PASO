export type RelativeFriendshipStatus =
  | "none"
  | "outgoing"
  | "incoming"
  | "friends"

export function friendshipPairKey(a: string, b: string): string {
  return [a, b].sort().join(":")
}

export function relativeStatus(
  requesterId: string,
  status: string,
  selfId: string,
): RelativeFriendshipStatus {
  if (status === "ACCEPTED") return "friends"
  if (status !== "PENDING") return "none"
  return requesterId === selfId ? "outgoing" : "incoming"
}

export function theOtherId(
  friendship: { requesterId: string; addresseeId: string },
  selfId: string,
): string {
  return friendship.requesterId === selfId
    ? friendship.addresseeId
    : friendship.requesterId
}