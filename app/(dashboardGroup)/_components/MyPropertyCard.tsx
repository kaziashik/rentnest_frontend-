import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ICategory, IProperty } from "@/lib/types";
import { BedIcon, MapPinIcon, ShowerHeadIcon } from "lucide-react";
import { PropertyFormDialog } from "./PropertyFormDialog";
import { DeletePropertyDialog } from "./DeletePropertyDialog";

type MyPropertyCardProps = {
    property: IProperty;
    categories: ICategory[];
}

export function MyPropertyCard({ property, categories }: MyPropertyCardProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant={property.availability === "AVAILABLE" ? "default" : "outline"}>
                        {property.availability}
                    </Badge>
                    <Badge variant="outline">{property.category.name}</Badge>
                </div>
                <CardTitle className="text-lg">{property.title}</CardTitle>
                <CardAction className="flex gap-2">
                    <PropertyFormDialog mode="edit" property={property} categories={categories} />
                    <DeletePropertyDialog propertyId={property.id} />
                </CardAction>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPinIcon className="size-3.5" />
                    {property.location}
                </div>

                <div className="flex flex-wrap gap-1.5">
                    {property.fetures.map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                        </Badge>
                    ))}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                            <BedIcon className="size-3.5" />
                            {property.bedRooms}
                        </span>
                        <span className="flex items-center gap-1">
                            <ShowerHeadIcon className="size-3.5" />
                            {property.bathRooms}
                        </span>
                    </div>
                    <span className="font-semibold text-foreground">
                        RM{property.rentPrice}/mo
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}