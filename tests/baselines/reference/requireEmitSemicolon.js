define(["require", "exports", "Person"], function(require, exports, __P__) {
    var P = __P__;

    (function (Database) {
        var DB = (function () {
            function DB() {
            }
            DB.prototype.findPerson = function (id) {
                return new P.Models.Person("Rock");
            };
            return DB;
        })();
        Database.DB = DB;
    })(exports.Database || (exports.Database = {}));
    var Database = exports.Database;
});
