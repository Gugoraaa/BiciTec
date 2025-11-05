type CsvRow = {
  [key: string]: string | number | null | undefined;
};

export const exportToCsv = (data: CsvRow[], filename: string, headers?: Record<string, string>): void => {
  if (data.length === 0) return;

  const headerLabels = headers || Object.fromEntries(
    Object.keys(data[0]).map(key => [key, key])
  );
  const csvContent = [
    Object.values(headerLabels).join(','),
    ...data.map(row => 
      Object.keys(headerLabels)
        .map(fieldName => {
          const value = row[fieldName] ?? '';
          const escaped = String(value).replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(',')
    )
  ].join('\n');

  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};