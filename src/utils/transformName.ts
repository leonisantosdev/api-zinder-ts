export const transformName = (name: string) => {
  return name.trim().toLowerCase().split(' ').map(word => {
    return word[0].toLocaleUpperCase().concat(word.substring(1));
  }).join(' ');
};