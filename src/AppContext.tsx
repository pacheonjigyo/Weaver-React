import React from "react";

import { itemStore, marketStore, searchStore, boardStore, tranStore, catStore } from "./stores";

export function createStores() {
    return {
        boardStore: new boardStore(),
        itemStore: new itemStore(),
        marketStore: new marketStore(),
        searchStore: new searchStore(),
        tranStore: new tranStore(),
        catStore: new catStore(),
    };
}

export const stores = createStores();
export const AppContext = React.createContext(stores);