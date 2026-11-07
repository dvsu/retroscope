-- A small inventory module.
local Inventory = {}
Inventory.__index = Inventory

local MAX = 64

function Inventory.new(owner)
  local self = setmetatable({}, Inventory)
  self.owner = owner or "nobody"
  self.items = {}
  return self
end

function Inventory:add(name, count)
  if #self.items >= MAX then
    return false, "full"
  end
  self.items[name] = (self.items[name] or 0) + (count or 1)
  return true, nil
end

local bag = Inventory.new("ada")
for i = 1, 3 do
  print(string.format("%s: %d", "apple", i), bag:add("apple", 2.5))
end

return Inventory
