// Correct -> Error: Call signatures of types '<T>(value: T) => T' and 'Underscore.Iterator<{}, boolean>' are incompatible.
_.all([true, 1, null, 'yes'], _.identity);

// Incorrect -> Error: Call signatures of types '<T>(value: T) => T' and 'Underscore.Iterator<boolean, boolean>' are incompatible.
_.all([true], _.identity);
