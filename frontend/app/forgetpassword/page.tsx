"use client";

import React, { useState, useEffect } from "react";
import { Form, Input, Button } from "@heroui/react";

interface FormDataType {
  [key: string]: FormDataEntryValue;
}

export default function App() {
  const [submitted, setSubmitted] = useState<FormDataType | null>(null); // Updated type for state
  const [isClient, setIsClient] = useState(false); // Flag to check if it's client-side

  useEffect(() => {
    // Ensures this runs only on the client side after the component mounts
    setIsClient(true);
  }, []);

  const onSubmit = (e: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined; }) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));

    setSubmitted(data as FormDataType); // Cast data to FormDataType
  };

  // Early return if not client-side
  if (!isClient) {
    return null; // Or a loading state
  }

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
