interface ISlugDictonaryTypes {
  [key: string]: string;
  "how-to": string;
}
const slugToTitleDictionary: ISlugDictonaryTypes = {
  "how-to": "How to",
};
export const convertToTitleDictionary = (slug: string): string => {
  if (slug in slugToTitleDictionary) {
    return slugToTitleDictionary[slug];
  }

  return (
    slug
      // .replace(/-/g, "")
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );

  // return (
  //   (slugToTitleDictionary as Record<string, string>)[slug] ||
  //   slug
  //     .replace(/-/g, "")
  //     .split("")
  //     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  //     .join("")
  // );
};
