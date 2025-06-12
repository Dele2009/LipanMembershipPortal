export interface ProfileCheckResult {
  totalFields: number;
  completedFields: number;
  incompleteFields: string[];
  completionPercentage: number;
  isComplete: boolean;
}

export function checkProfileCompletion(
  profile: Record<string, any>,
  excludeFields: string[] = []
): ProfileCheckResult {
  const keys = Object.keys(profile).filter(
    (key) => !excludeFields.includes(key)
  );
  const incompleteFields: string[] = [];

  keys.forEach((key) => {
    const value = profile[key];
    const isEmpty =
      value === null ||
      value === undefined ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === "object" &&
        !Array.isArray(value) &&
        Object.keys(value).length === 0);

    if (isEmpty) {
      incompleteFields.push(key);
    }
  });

  const totalFields = keys.length;
  const completedFields = totalFields - incompleteFields.length;
  const completionPercentage =
    totalFields === 0 ? 0 : Math.round((completedFields / totalFields) * 100);
  const isComplete = incompleteFields.length === 0;

  return {
    totalFields,
    completedFields,
    incompleteFields,
    completionPercentage,
    isComplete,
  };
}
