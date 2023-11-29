import { chakra, forwardRef, ImageProps } from "@chakra-ui/react";
import joyid from "./joyid.svg";
import metamask from "./metamask.svg";
import ethereum from "./ethereum.svg";
import polygon from "./polygon.svg";
import aragon from "./aragon.svg";
import daosquare from "./daosquare.svg";
import daohaus from "./daohaus.svg";

export const JoyIDIcon = forwardRef<ImageProps, "img">((props: any, ref: any) => {
    return <chakra.img src={joyid} ref={ref} width="2em" height="2em" {...props} />
});
export const MetaMaskIcon = forwardRef<ImageProps, "img">((props: any, ref: any) => {
    return <chakra.img src={metamask} ref={ref} width="2em" height="2em" {...props} />
});

export const EthereumIcon = forwardRef<ImageProps, "img">((props: any, ref: any) => {
    return <chakra.img src={ethereum} ref={ref} width="2em" height="2em" {...props} />
});
export const PolygonIcon = forwardRef<ImageProps, "img">((props: any, ref: any) => {
    return <chakra.img src={polygon} ref={ref} width="2em" height="2em" {...props} />
});

export const AragonIcon = forwardRef<ImageProps, "img">((props: any, ref: any) => {
    return <chakra.img src={aragon} ref={ref} width="2em" height="2em" {...props} />
});
export const DAOSquareIcon = forwardRef<ImageProps, "img">((props: any, ref: any) => {
    return <chakra.img src={daosquare} ref={ref} width="2em" height="2em" {...props} />
});
export const DAOhausIcon = forwardRef<ImageProps, "img">((props: any, ref: any) => {
    return <chakra.img src={daohaus} ref={ref} width="2em" height="2em" {...props} />
});