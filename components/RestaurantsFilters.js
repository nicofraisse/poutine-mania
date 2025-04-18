import classNames from "classnames";
import Skeleton from "react-loading-skeleton";
import Button from "components/Button";
import { Check, Sliders, X } from "react-feather";
import ReactSelect from "react-select";
import { useCallback, useState } from "react";
import Color from "color";
import { getRatingColor } from "../data/ratingColors";
import { RESTAURANT_CATEGORIES } from "../lib/constants";

export const RestaurantsFilters = ({
  filtersRef,
  restaurants,
  filtersOpen,
  setFiltersOpen,
  setSortType,
  setSortOrder,
  sortOrders,
  sortTypes,
  priceFilter: initialPriceFilter,
  setPriceFilter,
  categoryFilter: initialCategoryFilter,
  setCategoryFilter,
  ratingFilter: initialRatingFilter,
  setRatingFilter,
}) => {
  // Save initial states to reset later
  const initialStates = {
    localPriceFilter: initialPriceFilter || [],
    localCategoryFilter: initialCategoryFilter || [],
    localRatingFilter: initialRatingFilter || 0,
    sortType: sortTypes[0],
    sortOrder: sortOrders[0],
  };

  // local state for sorting
  const [localSortType, setLocalSortType] = useState(
    initialStates.sortType.value
  );
  const [localSortOrder, setLocalSortOrder] = useState(
    initialStates.sortOrder.value
  );

  const [localPriceFilter, setLocalPriceFilter] = useState(
    initialStates.localPriceFilter
  );
  const [localCategoryFilter, setLocalCategoryFilter] = useState(
    initialStates.localCategoryFilter
  );
  const [localRatingFilter, setLocalRatingFilter] = useState(
    initialStates.localRatingFilter
  );

  const priceOptions = [
    { label: "Moins de 8$", value: 1 },
    { label: "Entre 8$ et 10$", value: 2 },
    { label: "Plus de 10$", value: 3 },
  ];

  const handleCategorySelect = (category) => {
    if (localCategoryFilter.includes(category)) {
      setLocalCategoryFilter(localCategoryFilter.filter((c) => c !== category));
    } else {
      setLocalCategoryFilter([...localCategoryFilter, category]);
    }
  };

  const handlePriceSelect = (value) => {
    if (localPriceFilter.includes(value)) {
      setLocalPriceFilter(localPriceFilter.filter((v) => v !== value));
    } else {
      setLocalPriceFilter([...localPriceFilter, value]);
    }
  };

  const handleRatingChange = (event) => {
    setLocalRatingFilter(Number(event.target.value));
  };

  const handleApplyFilters = () => {
    setPriceFilter(localPriceFilter);
    setCategoryFilter(localCategoryFilter);
    setRatingFilter(localRatingFilter);
    setSortType(localSortType);
    setSortOrder(localSortOrder);
    setFiltersOpen(false);
    setFiltersApplied(areFiltersApplied());
  };

  const resetFilters = () => {
    setLocalPriceFilter([]);
    setLocalCategoryFilter([]);
    setLocalRatingFilter(0);
    setSortType(sortTypes[0].value);
    setSortOrder(sortOrders[0].value);
    setFiltersApplied(false);
  };

  const discardAppliedFilters = (e) => {
    // Prevent the event from bubbling up to the parent elements
    e.stopPropagation();

    resetFilters();
    setPriceFilter([]);
    setCategoryFilter([]);
    setRatingFilter(0);
    setSortType(sortTypes[0].value);
    setSortOrder(sortOrders[0].value);
    setFiltersApplied(false);
  };

  const areFiltersApplied = useCallback(() => {
    return (
      localPriceFilter.length > 0 ||
      localCategoryFilter.length > 0 ||
      localRatingFilter > 0
    );
  }, [localPriceFilter, localCategoryFilter, localRatingFilter]);

  const [filtersApplied, setFiltersApplied] = useState(false);

  const filtersCount = () => {
    return [
      localPriceFilter.length > 0,
      localCategoryFilter.length > 0,
      localRatingFilter > 0,
    ].filter((v) => v).length;
  };
  const someLocalFilters =
    localCategoryFilter.length > 0 ||
    localPriceFilter.length > 0 ||
    localRatingFilter > 0;

  return (
    <div className="relative" ref={filtersRef}>
      {!restaurants ? (
        <Skeleton height={36} width={36} />
      ) : (
        <Button
          variant="light"
          height="sm"
          className={classNames({
            "bg-slate-500 text-white hover:bg-slate-700 text-sm":
              filtersApplied,
          })}
          onClick={() => {
            setFiltersOpen(!filtersOpen);
          }}
        >
          {!filtersApplied && <Sliders className="mr-2" size={20} />}
          <span className="text-sm">Filtres</span>
          {filtersApplied && (
            <div className="flex items-center">
              <span className="mx-1">({filtersCount()})</span>
              <div
                id="filters-x-button"
                className="h-6 w-6 ml-1 rounded-full hover:bg-slate-400 flex items-center justify-center transition duration-150"
              >
                <X
                  className="cursor-pointer"
                  size={21}
                  onClick={(e) => discardAppliedFilters(e)}
                />
              </div>
            </div>
          )}
        </Button>
      )}

      <div
        className={classNames(
          "absolute top-[48px] right-0 w-[375px] bg-white transition-opacity duration-300 p-3 pt-4 rounded border z-50",
          {
            "shadow-lg opacity-100": filtersOpen,
            "shadow-none opacity-0 pointer-events-none": !filtersOpen,
          }
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-bold text-gray-500 mr-2">Tri par</div>
          <div className="flex items-center">
            <ReactSelect
              placeholder="Trier par..."
              options={sortTypes}
              className="mr-2 text-sm min-w-32"
              onChange={({ value }) => setLocalSortType(value)}
              defaultValue={initialStates.sortType}
            />
            <ReactSelect
              placeholder="Ordre"
              options={sortOrders}
              className="text-sm min-w-32"
              onChange={({ value }) => setLocalSortOrder(value)}
              defaultValue={initialStates.sortOrder}
            />
          </div>
        </div>
        <div className="w-full border-b border-gray mt-5 mb-4"></div>

        <div className="mt-3 text-sm font-bold text-gray-500 mb-2">
          Catégorie{" "}
          {localCategoryFilter.length > 0 && `(${localCategoryFilter.length})`}
        </div>
        <div className="flex flex-wrap">
          {RESTAURANT_CATEGORIES.map((category) => (
            <Pill
              key={category}
              onClick={() => handleCategorySelect(category)}
              caption={category}
              isSelected={localCategoryFilter.includes(category)}
              color={"blue"}
            />
          ))}
        </div>

        <div className="text-sm font-bold text-gray-500 mb-2 mt-4">
          Prix de la poutine classique{" "}
          {localPriceFilter.length > 0 && `(${localPriceFilter.length})`}
        </div>
        <div className="flex flex-wrap">
          {priceOptions.map((o) => (
            <Pill
              key={o.value}
              onClick={() => handlePriceSelect(o.value)}
              caption={o.label}
              isSelected={localPriceFilter.includes(o.value)}
              color={"purple"}
            />
          ))}
        </div>

        <div className="mt-3 text-sm font-bold text-gray-500 mb-1">
          Note minimale
        </div>
        <div className="flex items-center mb-2">
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={localRatingFilter}
            className="slider w-3/4"
            id="ratingSlider"
            onChange={handleRatingChange}
          />
          <div
            className="w-[4.5rem] ml-3 h-9 flex items-center justify-center rounded shadow"
            style={{
              backgroundColor: Color(getRatingColor(localRatingFilter)).lighten(
                0
              ),
            }}
          >
            <span className="font-black text-xl text-slate-600">
              {Math.round(localRatingFilter * 10) / 10}
            </span>
            <span className="text-slate-500 ml-[2px] block -mb-[2px]">/10</span>
          </div>
        </div>
        <div className="w-full border-b border-gray mt-5 mb-4"></div>
        <div className="flex justify-between items-center mb-1">
          <Button
            height="sm"
            width="sm"
            variant="lightLink"
            className={classNames("w-1/2", {
              "opacity-50": !someLocalFilters,
            })}
            onClick={resetFilters}
            disabled={!someLocalFilters}
          >
            <X className="mr-3" /> Réinitialiser
          </Button>

          <Button
            height="sm"
            width="sm"
            variant="light"
            className="w-1/2 ml-3"
            onClick={handleApplyFilters} // apply the filters when clicked
          >
            <Check size={22} className="mr-3" /> Valider
          </Button>
        </div>
      </div>
    </div>
  );
};

const Pill = ({ caption, isSelected, onClick, color }) => {
  return (
    <div
      className={classNames(
        "text-sm py-1 px-3 mr-2 mb-2 select-none rounded cursor-pointer transition duration-200",
        {
          [`bg-${color}-100 text-gray-400 hover:text-gray-500 hover:shadow hover:bg-${color}-200 hover:brightness-90`]:
            !isSelected,
          [`bg-${color}-500 text-white shadow`]: isSelected,
        }
      )}
      onClick={onClick}
    >
      {caption}
    </div>
  );
};
