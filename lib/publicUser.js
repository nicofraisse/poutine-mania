export const USER_PUBLIC_FIELDS = [
  "_id",
  "name",
  "image",
  "nbReviews",
  "eatenlist",
];

export const PUBLIC_USER_PROJECTION = USER_PUBLIC_FIELDS.reduce(
  (proj, key) => ({ ...proj, [key]: 1 }),
  {}
);

export const lookupPublicUser = ({
  from = "users",
  localField = "userId",
  foreignField = "_id",
  as = "user",
} = {}) => ({
  $lookup: {
    from,
    let: { localId: `$${localField}` },
    pipeline: [
      {
        $match: {
          $expr: { $eq: [`$${foreignField}`, "$$localId"] },
        },
      },
      { $project: PUBLIC_USER_PROJECTION },
    ],
    as,
  },
});

export async function getPublicUser(db, { userId, slug }) {
  const identifier = slug ? { slug } : { _id: userId };
  return db
    .collection("users")
    .findOne(identifier, { projection: PUBLIC_USER_PROJECTION });
}

export const mapToPublicUser = (user) => {
  if (!user) return null;
  const out = {};
  for (const key of USER_PUBLIC_FIELDS) {
    if (user[key] !== undefined) out[key] = user[key];
  }
  return out;
};
