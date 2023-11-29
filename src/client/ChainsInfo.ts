export const ChainsInfo = {
    useMainnet: false,
    ethereum: {
        name: "Ethereum",
        testnet: {
            chainId: BigInt(11155111),
            requestParams: {
                chainId: "0xaa36a7",
                rpcUrl: "https://rpc.sepolia.org"
            },
        },
        mainnet: {
            chainId: BigInt(1),
            requestParams: {
                chainId: "0x1",
                rpcUrl: "https://1rpc.io/eth"
            },
        }
    },
    arbitrum: {
        name: "Arbitrum",
        testnet: {
            chainId: BigInt(421614),
            requestParams: {
                chainId: "0x66eee",
                rpcUrl: "https://sepolia-rollup.arbitrum.io/rpc"
            },
        },
        mainnet: {
            chainId: BigInt(42161),
            requestParams: {
                chainId: "0xa4b1",
                rpcUrl: "https://arb1.arbitrum.io/rpc"
            },
        }
    },
    // arbNova: {
    //     name: "Arbitrum Nova",
    //     testnet: {
    //         chainId: BigInt(421614),
    //         requestParams: {
    //             chainId: "0x66eee",
    //             rpcUrl: "https://sepolia-rollup.arbitrum.io/rpc"
    //         },
    //     },
    //     mainnet: {
    //         chainId: BigInt(42170),
    //         requestParams: {
    //             chainId: "0xa4ba",
    //             rpcUrl: "https://nova.arbitrum.io/rpc"
    //         },
    //     }
    // },
    base: {
        name: "Base",
        testnet: {
            chainId: BigInt(84531),
            requestParams: {
                chainId: "0x14a33",
                rpcUrl: "https://goerli.base.org"
            },
        },
        mainnet: {
            chainId: BigInt(8453),
            requestParams: {
                chainId: "0x2105",
                rpcUrl: "https://mainnet.base.org"
            },
        }
    },
    celo: {
        name: "Celo",
        testnet: {
            chainId: BigInt(44787),
            requestParams: {
                chainId: "0xaef3",
                rpcUrl: "https://alfajores-forno.celo-testnet.org"
            },
        },
        mainnet: {
            chainId: BigInt(42220),
            requestParams: {
                chainId: "0xa4ec",
                rpcUrl: "https://forno.celo.org"
            },
        }
    },
    godwoken: {
        name: "Godwoken",
        testnet: {
            chainId: BigInt(71401),
            requestParams: {
                chainId: "0x116e9",
                rpcUrl: "https://v1.testnet.godwoken.io/rpc"
            },
        },
        mainnet: {
            chainId: BigInt(71402),
            requestParams: {
                chainId: "0x116ea",
                rpcUrl: "https://v1.mainnet.godwoken.io/rpc"
            },
        }
    },
    gnosis: {
        name: "Gnosis",
        testnet: {
            chainId: BigInt(10200),
            requestParams: {
                chainId: "0x27d8",
                rpcUrl: "https://rpc.chiadochain.net"
            },
        },
        mainnet: {
            chainId: BigInt(100),
            requestParams: {
                chainId: "0x64",
                rpcUrl: "https://rpc.gnosischain.com"
            },
        }
    },
    linea: {
        name: "Linea",
        testnet: {
            chainId: BigInt(59140),
            requestParams: {
                chainId: "0xe704",
                rpcUrl: "https://rpc.goerli.linea.build/"
            },
        },
        mainnet: {
            chainId: BigInt(59144),
            requestParams: {
                chainId: "0xe708",
                rpcUrl: "https://rpc.linea.build/"
            },
        }
    },
    opBnb: {
        name: "opBnb",
        testnet: {
            chainId: BigInt(5611),
            requestParams: {
                chainId: "0x15eb",
                rpcUrl: "https://opbnb-testnet-rpc.bnbchain.org/"
            },
        },
        mainnet: {
            chainId: BigInt(204),
            requestParams: {
                chainId: "0xcc",
                rpcUrl: "https://opbnb-mainnet-rpc.bnbchain.org"
            },
        }
    },
    optimism: {
        name: "Optimism",
        testnet: {
            chainId: BigInt(420),
            requestParams: {
                chainId: "0x1a4",
                rpcUrl: "https://goerli.optimism.io	"
            },
        },
        mainnet: {
            chainId: BigInt(10),
            requestParams: {
                chainId: "0xa",
                rpcUrl: "https://mainnet.optimism.io"
            },
        }
    },
    pgn: {
        name: "PGN",
        testnet: {
            chainId: BigInt(58008),
            requestParams: {
                chainId: "0xe298",
                rpcUrl: "https://sepolia.publicgoods.network"
            },
        },
        mainnet: {
            chainId: BigInt(424),
            requestParams: {
                chainId: "0x1A8",
                rpcUrl: "https://rpc.publicgoods.network"
            },
        }
    },
    polygon: {
        name: "Polygon",
        testnet: {
            chainId: BigInt(80001),
            requestParams: {
                chainId: "0x13881",
                rpcUrl: "https://polygon-mumbai-bor.publicnode.com"
            },
        },
        mainnet: {
            chainId: BigInt(137),
            requestParams: {
                chainId: "0x89",
                rpcUrl: "https://1rpc.io/matic"
            },
        }
    },
    // polygonZkEvm: {
    //     name: "Polygon zkEVM",
    //     testnet: {
    //         chainId: BigInt(1442),
    //         requestParams: {
    //             chainId: "0x5a2",
    //             rpcUrl: "https://rpc.public.zkevm-test.net"
    //         },
    //     },
    //     mainnet: {
    //         chainId: BigInt(1101),
    //         requestParams: {
    //             chainId: "0x44d",
    //             rpcUrl: "https://zkevm-rpc.com"
    //         },
    //     }
    // },
    // scroll: {
    //     name: "Scroll",
    //     testnet: {
    //         chainId: BigInt(534351),
    //         requestParams: {
    //             chainId: "0x8274f",
    //             rpcUrl: "https://sepolia-rpc.scroll.io"
    //         },
    //     },
    //     mainnet: {
    //         chainId: BigInt(534352),
    //         requestParams: {
    //             chainId: "0x82750",
    //             rpcUrl: "https://rpc.scroll.io"
    //         },
    //     }
    // },
    // taiko: {
    //     name: "Taiko",
    //     testnet: {
    //         chainId: BigInt(167007),
    //         requestParams: {
    //             chainId: "0x28c5f",
    //             rpcUrl: "https://rpc.jolnir.taiko.xyz"
    //         },
    //     },
    //     mainnet: {
    //         chainId: BigInt(0),
    //         requestParams: {
    //             chainId: "",
    //             rpcUrl: ""
    //         },
    //     }
    // },
    // zksync: {
    //     name: "zkSync",
    //     testnet: {
    //         chainId: BigInt(280),
    //         requestParams: {
    //             chainId: "0x118",
    //             rpcUrl: "https://testnet.era.zksync.dev"
    //         },
    //     },
    //     mainnet: {
    //         chainId: BigInt(324),
    //         requestParams: {
    //             chainId: "0x144",
    //             rpcUrl: "https://mainnet.era.zksync.io"
    //         },
    //     }
    // },
    // zora: {
    //     name: "Zora",
    //     testnet: {
    //         chainId: BigInt(999),
    //         requestParams: {
    //             chainId: "0x3E7",
    //             rpcUrl: "https://testnet.rpc.zora.energy/"
    //         },
    //     },
    //     mainnet: {
    //         chainId: BigInt(7777777),
    //         requestParams: {
    //             chainId: "0x76adf1",
    //             rpcUrl: "https://rpc.zora.energy/"
    //         },
    //     }
    // }
}