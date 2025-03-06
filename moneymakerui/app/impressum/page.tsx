"use client";

export default function Impressum() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Impressum</h1>
      <p className="mb-2">
        <strong>Company Name:</strong> MoreMoney Team
      </p>
      <p className="mb-2">
        <strong>Address:</strong> Musterstraße 123, 12345 Musterstadt, Germany
      </p>
      <p className="mb-2">
        <strong>Phone:</strong> +49 123 456789
      </p>
      <p className="mb-2">
        <strong>Email:</strong> info@example.com
      </p>
      <p className="mb-2">
        <strong>Managing Director:</strong> John Doe
      </p>
      <p className="mb-2">
        <strong>Commercial Register:</strong> Amtsgericht Musterstadt, HRB 12345
      </p>
      <p className="mb-2">
        <strong>VAT ID:</strong> DE123456789
      </p>
      <p className="mt-4">
        <em>
          Disclaimer: This is a sample Impressum provided for demonstration purposes only.
        </em>
      </p>
    </div>
  );
}
