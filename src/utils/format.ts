export const formatDate = (date: string | null) =>
  date
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(`${date}T12:00:00`))
    : "Not filed";
