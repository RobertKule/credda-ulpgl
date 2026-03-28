import { cn } from "@/lib/utils";

describe("Utils: cn", () => {
  it("should merge tailwind classes properly", () => {
    expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white");
    expect(cn("px-2 py-1", "p-4")).toBe("p-4");
  });

  it("should handle conditional classes", () => {
    expect(cn("base-class", true && "active", false && "inactive")).toBe("base-class active");
  });
});
