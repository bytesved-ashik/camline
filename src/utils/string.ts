export const stringTruncate = (content: string, limit: number) => {
  if (content.length <= limit) {
    return content;
  }
  const toShow = `${content.substring(0, limit)}...`;

  return toShow;
};

export const getInitials = (content?: string) => {
  if (!content) {
    return "";
  }
  const nameArray = content.split(" ");
  const firstName = nameArray[0].charAt(0).toUpperCase();
  const lastName = nameArray[nameArray.length - 1].charAt(0).toUpperCase();

  return firstName + lastName;
};

export const userId = {
  id: "",
  get getUserId() {
    return this.id;
  },

  set setUserId(value: string) {
    this.id = value;
  },
};
