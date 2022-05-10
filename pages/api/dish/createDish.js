import  clientPromise  from '../../lib/mongodb'

export default async (req, res) => {
  const client = await clientPromise
  const dish = await client
    .db()
    .collection("Categories")
    .find({})
    .toArray();
  res.json(categories);
}