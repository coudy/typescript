interface IPerson {
   firstName: string;
   lastName: string;
}
var persons: { [id: string]: IPerson; } = {
   "p1": { firstName: "F1", lastName: "L1" },
   "p2": { firstName: "F2" }
};
