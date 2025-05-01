import { chakra, forwardRef, ImageProps } from "@chakra-ui/react";
import joyid from "./joyid.svg";
import metamask from "./metamask.svg";
import ethereum from "./ethereum.svg";
import arb from "./arbitrum.svg";
import base from "./base.svg";
import celo from "./celo.svg";
import gnosis from "./gnosis.svg";
import op from "./op.svg";
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
export const ArbitrumIcon = forwardRef<ImageProps, "img">((props: any, ref: any) => {
    return <chakra.img src={arb} ref={ref} width="2em" height="2em" {...props} />
});
export const BaseIcon = forwardRef<ImageProps, "img">((props: any, ref: any) => {
    return <chakra.img src={base} ref={ref} width="2em" height="2em" {...props} />
});
export const CeloIcon = forwardRef<ImageProps, "img">((props: any, ref: any) => {
    return <chakra.img src={celo} ref={ref} width="2em" height="2em" {...props} />
});
export const GnosisIcon = forwardRef<ImageProps, "img">((props: any, ref: any) => {
    return <chakra.img src={gnosis} ref={ref} width="2em" height="2em" {...props} />
});
export const OptimismIcon = forwardRef<ImageProps, "img">((props: any, ref: any) => {
    return <chakra.img src={op} ref={ref} width="2em" height="2em" {...props} />
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