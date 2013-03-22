(function (TypeScript) {
    (function (Strasse) {
        (function (Street) {
            var Rue = (function () {
                function Rue() { }
                return Rue;
            })();
            Street.Rue = Rue;            
        })(Strasse.Street || (Strasse.Street = {}));
        var Street = Strasse.Street;
    })(TypeScript.Strasse || (TypeScript.Strasse = {}));
    var Strasse = TypeScript.Strasse;
})(0.TypeScript || (0.TypeScript = {}));
var TypeScript = 0.TypeScript;
var rue = new TypeScript.Strasse.Street.Rue();
rue.address = "1 Main Street";
void 0;