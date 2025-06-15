
export const navItems = [
  {
    name: "Engineering",
    hasDropdown: true,
    path: "/colleges?category=engineering",
    dropdownItems: [
      { name: "Computer Science", path: "/colleges?category=engineering&field=cs" },
      { name: "Mechanical", path: "/colleges?category=engineering&field=mechanical" },
      { name: "Electronics", path: "/colleges?category=engineering&field=electronics" },
      { name: "Civil", path: "/colleges?category=engineering&field=civil" },
    ]
  },
  {
    name: "Management",
    hasDropdown: true,
    path: "/colleges?category=mba",
    dropdownItems: [
      { name: "MBA", path: "/colleges?category=mba" },
      { name: "PGDM", path: "/colleges?category=pgdm" },
      { name: "Executive MBA", path: "/colleges?category=executive-mba" },
    ]
  },
  {
    name: "Medical",
    hasDropdown: true,
    path: "/colleges?category=medical",
    dropdownItems: [
      { name: "MBBS", path: "/colleges?category=medical&field=mbbs" },
      { name: "BDS", path: "/colleges?category=medical&field=bds" },
      { name: "Nursing", path: "/colleges?category=medical&field=nursing" },
      { name: "Pharmacy", path: "/colleges?category=medical&field=pharmacy" },
    ]
  },
  {
    name: "Design",
    hasDropdown: true,
    path: "/colleges?category=design",
    dropdownItems: [
      { name: "Fashion Design", path: "/colleges?category=design&field=fashion" },
      { name: "Interior Design", path: "/colleges?category=design&field=interior" },
      { name: "Graphic Design", path: "/colleges?category=design&field=graphic" },
    ]
  },
  {
    name: "More",
    hasDropdown: true,
    path: "/colleges",
    dropdownItems: [
      { name: "Law", path: "/colleges?category=law" },
      { name: "Arts", path: "/colleges?category=arts" },
      { name: "Commerce", path: "/colleges?category=commerce" },
      { name: "Science", path: "/colleges?category=science" },
    ]
  },
  { name: "Online", path: "/colleges?mode=online", hasDropdown: false, isHighlighted: true },
  { name: "Exams", path: "/exams", hasDropdown: false },
  { name: "Articles", path: "/articles", hasDropdown: false },
  { name: "Courses", path: "/courses", hasDropdown: false },
];

export type NavigationItem = typeof navItems[0];
