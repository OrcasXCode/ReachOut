"use client";

import React, { useState } from "react";
import { Form, Input, Button } from "@heroui/react";

export default function App() {
  const [submitted, setSubmitted] = useState<{ email?: string } | null>(null);

  // Form submission handler
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Get form data
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;

    // Update state with the form data
    setSubmitted(data);
  };

  return (
    <Form className="w-full max-w-xs" validationBehavior="native" onSubmit={onSubmit}>
      <Input
        isRequired
        errorMessage="Please enter a valid email"
        label="Email"
        labelPlacement="outside"
        name="email"
        placeholder="Enter your email"
        type="email"
      />
      <Button type="submit" variant="bordered">
        Submit
      </Button>
      {submitted && (
        <div className="text-small text-default-500">
          You submitted: <code>{JSON.stringify(submitted)}</code>
        </div>
      )}
    </Form>
  );
}
