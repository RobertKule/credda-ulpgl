import * as React from "react";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import '@testing-library/jest-dom';

describe("UI Components", () => {
  describe("Badge", () => {
    it("renders default badge", () => {
      render(<Badge>Test Badge</Badge>);
      expect(screen.getByText("Test Badge")).toBeInTheDocument();
      expect(screen.getByText("Test Badge")).toHaveClass("bg-primary");
    });
    
    it("renders secondary badge", () => {
      render(<Badge variant="secondary">Secondary</Badge>);
      expect(screen.getByText("Secondary")).toHaveClass("bg-secondary");
    });
  });

  describe("Button", () => {
    it("renders button correctly", () => {
      render(<Button>Click Me</Button>);
      expect(screen.getByRole("button", { name: "Click Me" })).toBeInTheDocument();
    });

    it("handles click events", () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);
      screen.getByRole("button").click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
    
    it("can be disabled", () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });
  });

  describe("Input", () => {
    it("renders input field", () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
    });
  });
});
