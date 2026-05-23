const DEFAULT_PREFIX_LENGTH = 6;
const DEFAULT_SUFFIX_LENGTH = 6;

export function formatStellarAddress(
  address: string,
  prefixLength = DEFAULT_PREFIX_LENGTH,
  suffixLength = DEFAULT_SUFFIX_LENGTH,
): string {
  if (!address.startsWith("G")) {
    throw new TypeError("Stellar account address must start with G");
  }

  if (address.length <= prefixLength + suffixLength + 1) {
    return address;
  }

  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
}

export function createStellarAccountLink(address: string): string {
  if (!address.startsWith("G")) {
    throw new TypeError("Stellar account address must start with G");
  }

  return `web+stellar:pay?destination=${encodeURIComponent(address)}`;
}

export async function copyStellarAddress(
  address: string,
  clipboard: Pick<Clipboard, "writeText"> = navigator.clipboard,
): Promise<void> {
  await clipboard.writeText(address);
}
