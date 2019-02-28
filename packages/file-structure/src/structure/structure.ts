// Dependencies:
import { Item } from './item';

export type Structure = {
    addItem (item: Item): void;
    removeItem (item: Item): void;
};
