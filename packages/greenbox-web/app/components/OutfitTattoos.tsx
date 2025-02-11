import { isOutfitTattoo } from "greenbox-data";
import { useMemo, useState } from "react";

import { useAppSelector } from "../hooks.js";
import { selectPlayerOutfitTattoos } from "../store/index.js";

import { SortOrderSelect, sortByKey } from "./SortOrderSelect.js";
import Subsection from "./Subsection.js";
import TattooGrid from "./TattooGrid.js";

export default function OutfitTattoos() {
  const allTattoos = useAppSelector((state) => state.tattoos);
  const playerTattoos = useAppSelector(selectPlayerOutfitTattoos);

  const [sortBy, setSortBy] = useState<"name" | "outfit">("name");

  const tattoos = useMemo(
    () => allTattoos.filter(isOutfitTattoo).toSorted(sortByKey(sortBy)),
    [allTattoos, sortBy],
  );

  const idToPlayerTattoo = useMemo(
    () =>
      playerTattoos.reduce(
        (acc, t) => ({ ...acc, [t[0]]: t }),
        {} as Record<number, (typeof playerTattoos)[number]>,
      ),
    [playerTattoos],
  );

  return (
    <Subsection
      title="Outfits"
      image="itemimages/palette.gif"
      farRight
      right={
        <SortOrderSelect
          onChange={setSortBy}
          value={sortBy}
          alphabeticalKey="name"
          chronologicalKey="outfit"
        />
      }
    >
      <TattooGrid
        tattoos={tattoos}
        getLevel={(t) => idToPlayerTattoo[t.outfit]?.[1] ?? 0}
      />
    </Subsection>
  );
}
