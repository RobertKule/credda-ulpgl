import { authOptions } from "@/lib/auth";

// Basic dummy test for auth configuration to ensure syntax and structure are sound
describe("Auth Configuration", () => {
  it("should have credentials provider defined", () => {
    expect(authOptions.providers.length).toBeGreaterThan(0);
    const credentialsProvider = authOptions.providers.find(
      (p: any) => p.name === "credentials" || p.id === "credentials"
    );
    expect(credentialsProvider).toBeDefined();
  });

  it("should use jwt strategy", () => {
    expect(authOptions.session?.strategy).toBe("jwt");
  });

  it("should have custom signIn page defined", () => {
    expect(authOptions.pages?.signIn).toBe("/login");
  });
});
