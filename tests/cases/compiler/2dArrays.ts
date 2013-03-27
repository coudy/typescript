class Cell {
}

class Ship {
    isSunk: bool;
}

class Board {
    ships: Ship[];
    cells: Cell[];

    private allShipsSunk() {
        return this.ships.every(function (val) { return val.isSunk; });
    }    
}