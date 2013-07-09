var P = require("Person");

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

