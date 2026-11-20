export default function downloadReport(audits) {
  if (!audits || audits.length === 0) {
    alert("No audit data available to download.");
    return;
  }

  // Collect every field that appears in any audit
  const columns = [
    ...new Set(
      audits.flatMap((audit) => Object.keys(audit))
    ),
  ];

  const escapeCsvValue = (value) => {
    if (value === null || value === undefined) return "";

    if (Array.isArray(value) || typeof value === "object") {
      value = JSON.stringify(value);
    }

    const stringValue = String(value);

    if (
      stringValue.includes(",") ||
      stringValue.includes('"') ||
      stringValue.includes("\n")
    ) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
  };

  const csv = [
    columns.join(","),
    ...audits.map((audit) =>
      columns
        .map((column) => escapeCsvValue(audit[column]))
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `walk-this-way-audit-report-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}