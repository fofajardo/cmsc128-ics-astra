"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {useMediaQuery} from "usehooks-ts";
import {cn} from "@/lib/utils.jsx";
import {ChevronsUpDown} from "lucide-react";
import {useEffect} from "react";

export function ComboBoxResponsive({items, placeholder, value, onChange, ...props}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedItem, setSelectedItem] = React.useState(value);

  useEffect(function() {
    if (onChange) {
      onChange(selectedItem);
    }
  }, [selectedItem, onChange]);

  const triggerButton = (
    <Button
      variant="outline"
      role="combobox"
      {...props}
      className={cn(
        "w-full justify-between",
        !selectedItem && "text-muted-foreground",
        props.className
      )}
    >
      {selectedItem ? <>{selectedItem.label}</> : <>{placeholder}</>}
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  );

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {triggerButton}
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <ItemList items={items} setOpen={setOpen} setSelectedItem={setSelectedItem} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {triggerButton}
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <ItemList items={items} setOpen={setOpen} setSelectedItem={setSelectedItem} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function ItemList({ items, setOpen, setSelectedItem }) {
  return (
    <Command>
      <CommandInput placeholder="Filter status..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {items.map((item) => (
            <CommandItem
              key={item.value}
              value={item.value}
              onSelect={(value) => {
                setSelectedItem(
                  items.find((priority) => priority.value === value) || null
                );
                setOpen(false);
              }}
            >
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
