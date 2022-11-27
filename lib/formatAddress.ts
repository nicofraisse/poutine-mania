export const formatAddress = (restaurant) => {
  return restaurant.succursales.length > 1
    ? `${restaurant.succursales.length} addresses au Québec`
    : restaurant.succursales[0].address.place_name
}
