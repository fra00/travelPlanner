/**
 * Triggers a browser download for the given data as a JSON file.
 * @param {object} data The JavaScript object to save.
 * @param {string} filename The name of the file to be saved.
 */
export const saveDataToFile = (data, filename) => {
  const jsonString = JSON.stringify(data, null, 2); // Pretty print JSON
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Reads a file from a file input and parses it as JSON.
 * @param {File} file The file object from an <input type="file">.
 * @returns {Promise<object>} A promise that resolves with the parsed JSON data.
 */
export const loadDataFromFile = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error("Nessun file selezionato."));
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        resolve(JSON.parse(e.target.result));
      } catch (err) {
        reject(new Error("Errore nel parsing del file JSON."));
      }
    };
    reader.onerror = (e) => reject(new Error("Errore nella lettura del file."));
    reader.readAsText(file);
  });
};
