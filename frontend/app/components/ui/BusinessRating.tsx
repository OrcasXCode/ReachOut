import React from "react";
import { Rating, Typography } from "@material-tailwind/react";
 
export default function RatingWithText() {
  const [rated, setRated] = React.useState(4);
 
  return (
    <div className="flex items-center gap-2 font-bold text-blue-gray-500 text-sm">
      {rated}.7
      <Rating className="text-amber-300" value={4} onChange={(value) => setRated(value)} />
      {/* <Typography color="blue-gray" className="font-medium text-sm text-blue-gray-500">
        Based on 134 Reviews
      </Typography> */}
    </div>
  );
}