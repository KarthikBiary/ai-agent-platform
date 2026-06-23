import { calls } from "@/lib/data/seed";

const callsStore: typeof calls = [...calls];

export async function deleteCall(id: string): Promise<boolean> {
  const index = callsStore.findIndex((c) => c.id === id);
  if (index === -1) return false;
  callsStore.splice(index, 1);
  return true;
}