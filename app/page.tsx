"use client";

import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import TurboSearchBox from "react-turbo-search-box";

import maleNames from "./fake-data/names-male.json";
import femaleNames from "./fake-data/names-female.json";
import surnames from "./fake-data/names-surnames.json";
import { useMemo, useState } from "react";

const possibleMaleNames = JSON.parse(JSON.stringify(maleNames)).data;
const possibleFemaleNames = JSON.parse(JSON.stringify(femaleNames)).data;
const possibleSurnames = JSON.parse(JSON.stringify(surnames)).data;

/** Creates a fake name FIRST LAST */
const createFakeName = () => {
    const name = {
        first: possibleMaleNames[
            Math.floor(Math.random() * possibleMaleNames.length)
        ],
        last: possibleSurnames[
            Math.floor(Math.random() * possibleSurnames.length)
        ],
    };
    if (Math.random() > 0.5) {
        name.first =
            possibleFemaleNames[
                Math.floor(Math.random() * possibleFemaleNames.length)
            ];
    }
    return `${name.first} ${name.last}`;
};

/**
 * Creates a fake substring of a name for testing purposes.
 * @param findable - If true, the substring will be found in the names of one of the elements in the list.
 * @param list - The list of names to search through.
 * @returns A string that is a substring (of length between 1 and the length of the name) of a name in the list.
 */
const createFakeSubstring = <T extends { name: string }[]>(
    findable: boolean,
    list: T
) => {
    const name = list[Math.floor(Math.random() * list.length)].name;

    // substring can start at any index between 0 and the length of the name,
    // and can end at any index between 1 and the length of the name
    const start = Math.floor(Math.random() * name.length);
    const end = Math.floor(Math.random() * (name.length - start)) + start + 1;
    const substring = name.substring(start, end);

    if (findable) {
        return substring;
    } else {
        return substring + "asf"; // lol
    }
};

/** Generate a full list of objects for testing */
const generateTestList = (n: number) => {
    const list = [];
    for (let i = 0; i < n; i++) {
        list.push({
            id: i,
            name: createFakeName(),
        });
    }
    return list;
};

/** Generate a sublist of a given list for testing */
const generateRandomSublist = <T,>(list: T[], n: number) => {
    const sublist = [];
    for (let i = 0; i < n; i++) {
        sublist.push(list[Math.floor(Math.random() * list.length)]);
    }
    return sublist;
};

// ----- Testable Data and Tester Functions -----

/**
 * Generate an immutable list, sublist, and searchText for testing purposes.
 *
 * @param fullSize - The size of the full list (defaults to 100).
 * @param subSize - The size of the sublist (defaults to 25).
 */
const getTestData = (fullSize = 25, subSize = 10) => {
    const fullBaseList = generateTestList(fullSize);
    const currWorkingList = generateRandomSublist<typeof fullBaseList[0]>(
        fullBaseList,
        subSize
    );

    return { fullBaseList, currWorkingList } as const;
};

export default function Home() {
    const { fullBaseList, currWorkingList } = useMemo(() => getTestData(), []);

    const [list, setList] = useState(currWorkingList);

    return (
        <main className={styles.main}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100vw",
                }}
            >
                <TurboSearchBox
                    /* Set the rendered list you want to show */
                    dispatchNewList={setList}
                    sortBehavior={{
                        /* Keys to use in comparisons to determine search/sorted order */
                        keys: ["name"],
                    }}
                    lockBehavior={{}}
                    info={{
                        /* List of all items to search through */
                        fullBaseList: fullBaseList,
                        /* List of items that are currently being displayed */
                        currWorkingList: list,
                    }}
                    style={{
                        width: "50%",
                    }}
                />
                <div
                    style={{
                        width: "50%",
                        height: "fit-content",
                        display: "flex",
                        flexDirection: "column-reverse",

                        alignItems: "center",
                        justifyContent: "start",
                        gap: "10px",
                        borderRadius: "10px",
                    }}
                >
                    {list.map((item) => {
                        return (
                            <div
                                style={{
                                    width: "80%",
                                    height: "fit-content",
                                    border: "1px rgba(0, 0, 0, 0.2) solid",
                                    color: "rgba(0, 0, 0, 0.8)",
                                    padding: "10px",
                                    borderRadius: "50px",
                                    paddingLeft: "25px",
                                }}
                                key={item.name}
                            >
                                {item.name}
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
