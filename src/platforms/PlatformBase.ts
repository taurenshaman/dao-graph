import { DAOInfo } from "../models/DAOInfo";

export class PlatformBase {
    items: Array<DAOInfo> = [];

    parse(originalItems: any) {}
}