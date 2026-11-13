// export type PrototypeCardCategories_Type = "Artefact" | "Champion" | "Combattant" | "Dark Héros" | "Demi Héros" | "Héros" | "Multi Héros" | "Terrain"
export type PrototypeCardCategories_Type = "artefact" | "champion" | "combattant" | "darkHeros" | "demiHeros" | "heros" | "multiHeros" | "terrain"
export type PrototypeCardFamilies_Type = "" | "ÂmesDamnées" | "AncientCodex" | "ArchangeDeL'antre-Monde" | "ArtsDuKajutsu" | "AstresNoirs" | "Atlantis" | "BoisDesFendus" | "Calussons" | "ChevaliersDraconiques" | "ChevaliersTeutoniques" | "Crocoparc" | "Croisédia" | "Désenchanté" | "Dreamcode" | "EldenQuedzacoalixir" | "Færune" | "Gardiens Stellaires Z" | "GigaBeast" | "Glorious Lux" | "Gova's Paradox" | "Invitation" | "Jurassique!" | "Magicalchimiste" | "MalédictionDesAngesDéchus" | "Masquerade" | "MiroirDesOmbres" | "Nephertys" | "Origines" | "PaperExpress" | "PhantomSkulls" | "PistonCup" | "PoussièreEnchantée" | "Quartero" | "Rainbowgeddon" | "RêvesÉcarlates" | "RochesArdentes" | "SentinelleGardienna" | "SheepSheep" | "SplinteredMemories" | "Stargazed" | "Terraflora" | "Totam" | "Tripside" | "WingsOfDestiny" | "Zephron"
// export type PrototypeCardTypes_Type = "Eau" | "Feu" | "Force" | "Magie" | "Multicolore" | "Plante" | "Vent"
export type PrototypeCardTypes_Type = "eau" | "feu" | "force" | "magie" | "multicolore" | "plante" | "vent"
export type PrototypeCardStars_Type = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
export type PrototypeCardCollections_Type = "Les Armes de Légende" | "L'Art des Maîtres" | "Le Secret des Limbes" | "Rainbowgeddon" | "Wings of Destiny" 

export interface PrototypeCard_Type {
    id: number,
    name: string,
    category: PrototypeCardCategories_Type,
    family: PrototypeCardFamilies_Type,
    type: PrototypeCardTypes_Type,
    stars: PrototypeCardStars_Type,
    baseAtk?: number,
    baseDef?: number,
    description?: string,
    collection:  PrototypeCardCollections_Type,
};
