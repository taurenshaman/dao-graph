import { ComponentWithAs, ImageProps } from "@chakra-ui/react";
import { AragonIcon, DAOSquareIcon, DAOhausIcon } from "../icons/Icons";

export type PlatformDataType = {
    name: string;
    icon: ComponentWithAs<"img", ImageProps>;
    website: string;
    twitter: string;
    forum: string;
    discord: string;
    github: string;
    gov: string;
}

export const PlatformsData = {
    aragon: {
        name: "Aragon",
        icon: AragonIcon,
        website: "https://aragon.org/",
        twitter: "https://twitter.com/aragonproject",
        forum: "https://forum.aragon.org/",
        discord: "https://discordapp.com/invite/eqQJkdp",
        github: "https://github.com/aragon",
        gov: "https://aragon.org/aragon-dao"
    },
    daohaus: {
        name: "DAOhaus",
        icon: DAOhausIcon,
        website: "https://daohaus.club/",
        twitter: "https://twitter.com/daohaus",
        forum: "",
        discord: "https://discord.gg/daohaus",
        github: "https://github.com/HausDAO",
        gov: "https://admin.daohaus.club/#/molochv3/0xa/0xf5d6b637a9185707f52d40d452956ca49018247a"
    },
    daosquare: {
        name: "DAOSquare",
        icon: DAOSquareIcon,
        website: "https://daosquare.io/",
        twitter: "https://twitter.com/DAOSquare",
        forum: "https://forum.daosquare.io/",
        discord: "https://discord.com/invite/daosquare",
        github: "https://github.com/DAOSquare",
        gov: ""
    },
};