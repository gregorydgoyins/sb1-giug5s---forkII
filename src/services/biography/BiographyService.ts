import { ErrorHandler } from '../../utils/errors';
import type { CreatorBiography, CharacterBiography } from './types';

export class BiographyService {
  private static instance: BiographyService;
  private errorHandler: ErrorHandler;
  private creatorBios: Map<string, CreatorBiography>;
  private characterBios: Map<string, CharacterBiography>;

  private constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.creatorBios = new Map();
    this.characterBios = new Map();
    this.initializeBiographies();
  }

  public static getInstance(): BiographyService {
    if (!BiographyService.instance) {
      BiographyService.instance = new BiographyService();
    }
    return BiographyService.instance;
  }

  private initializeBiographies(): void {
    // Initialize Todd McFarlane biography
    this.creatorBios.set('todd-mcfarlane', {
      id: 'todd-mcfarlane',
      name: 'Todd McFarlane',
      birthDate: '1961-03-16',
      nationality: 'Canadian',
      biography: `Todd McFarlane revolutionized comic book art in the late 1980s with his dynamic art style on Spider-Man. Born in Calgary, Alberta, he began his career with DC Comics before making his mark at Marvel Comics. His innovative work on Spider-Man set new standards for comic art, introducing intricate web designs and dynamic poses that became industry standards.

After co-founding Image Comics in 1992, he created Spawn, which broke independent comic sales records and ran for over 300 issues. Beyond comics, McFarlane built a multimedia empire including toys, animation, and film production. His McFarlane Toys company transformed the action figure industry with highly detailed sculpts and innovative designs.

McFarlane's influence extends across comics, toys, and entertainment, making him a pivotal figure in modern pop culture. His commitment to creator rights and independent publishing helped reshape the comics industry's business model.`,
      notableWorks: [
        'The Amazing Spider-Man (1988-1990)',
        'Spider-Man (1990-1991)',
        'Spawn (1992-present)',
        'Venom: The Enemy Within (1994)'
      ],
      achievements: [
        'Multiple Eisner Awards',
        'Grammy Award for Best Short Form Music Video',
        'Emmy Award for Outstanding Animation Program',
        'Independent comic sales records with Spawn #1'
      ],
      style: {
        description: 'Dynamic, detailed artwork with emphasis on intricate designs and dramatic poses',
        innovations: [
          'Revolutionary Spider-Man web designs',
          'Cinematic panel layouts',
          'Detailed costume aesthetics'
        ],
        influences: [
          'Art Adams',
          'Michael Golden',
          'Frank Miller'
        ]
      },
      impact: {
        industry: [
          'Co-founded Image Comics',
          'Pioneered creator-owned publishing',
          'Revolutionized action figure industry'
        ],
        legacy: [
          'Influenced modern comic art style',
          'Advanced creator rights',
          'Expanded comics into multimedia'
        ]
      },
      currentWork: {
        projects: [
          'Spawn Universe expansion',
          'McFarlane Toys production',
          'Film and television development'
        ],
        roles: [
          'President of Image Comics',
          'CEO of McFarlane Toys',
          'Creator and artist'
        ]
      }
    });

    // Initialize Stan Lee biography
    this.creatorBios.set('stan-lee', {
      id: 'stan-lee',
      name: 'Stan Lee',
      birthDate: '1922-12-28',
      deathDate: '2018-11-12',
      nationality: 'American',
      biography: `Stan Lee transformed comic books and pop culture through his revolutionary approach to storytelling and character development. Born Stanley Martin Lieber in New York City, he joined Timely Comics (later Marvel Comics) as an assistant in 1939 and became interim editor at age 19.

In the early 1960s, Lee and artist Jack Kirby created the Fantastic Four, revolutionizing superhero comics with complex characters who dealt with real-world problems. This launched the Marvel Age of Comics, followed by the creation of iconic characters like Spider-Man, the X-Men, and the Avengers.

Lee's "Marvel Method" of comic creation and his innovative approach to fan engagement through letter columns and "Stan's Soapbox" helped build a passionate community around Marvel Comics. He pioneered the interconnected universe concept that would later influence modern entertainment franchises.`,
      notableWorks: [
        'Fantastic Four (1961)',
        'Amazing Fantasy #15 (First Spider-Man)',
        'The X-Men (1963)',
        'The Avengers (1963)'
      ],
      achievements: [
        'Will Eisner Award Hall of Fame',
        'National Medal of Arts',
        'Hollywood Walk of Fame star',
        'Disney Legends Award'
      ],
      style: {
        description: 'Character-driven storytelling with emphasis on human flaws and real-world issues',
        innovations: [
          'Marvel Method of comic creation',
          'Interconnected universe concept',
          'Sophisticated dialogue and characterization'
        ],
        influences: [
          'Shakespeare',
          'Charles Dickens',
          'Arthur Conan Doyle'
        ]
      },
      impact: {
        industry: [
          'Created the Marvel Universe',
          'Revolutionized superhero characterization',
          'Modernized comic book dialogue'
        ],
        legacy: [
          'Established Marvel as a global brand',
          'Influenced modern entertainment',
          'Pioneered fan engagement'
        ]
      },
      currentWork: {
        projects: [
          'Posthumous projects and adaptations',
          'Cultural icon and legacy',
          'Continued influence on Marvel properties'
        ],
        roles: [
          'Chairman Emeritus of Marvel Comics (former)',
          'Pop culture icon',
          'Entertainment pioneer'
        ]
      }
    });

    // Initialize Spider-Man character biography
    this.characterBios.set('spider-man', {
      id: 'spider-man',
      name: 'Spider-Man',
      alterEgo: 'Peter Parker',
      firstAppearance: {
        issue: 'Amazing Fantasy #15',
        date: '1962-08',
        publisher: 'Marvel Comics',
        era: 'Silver Age',
        creators: ['Stan Lee', 'Steve Ditko']
      },
      origin: {
        narrative: `Peter Parker, a brilliant but shy high school student, gained superhuman abilities after being bitten by a radioactive spider during a science exhibition. Initially using his powers for personal gain, he learned that "with great power comes great responsibility" following the death of his Uncle Ben, whom he could have prevented being killed.`,
        powers: [
          'Wall-crawling',
          'Superhuman strength and agility',
          'Spider-sense',
          'Genius-level intellect'
        ],
        motivation: 'Personal tragedy and responsibility'
      },
      significance: {
        cultural: 'Revolutionized superhero archetype with relatable personal struggles',
        industry: 'Helped establish Marvel Comics as a major publisher',
        impact: 'One of the most recognizable and merchandised superheroes globally'
      },
      keyStorylines: [
        {
          title: 'The Night Gwen Stacy Died',
          issue: 'The Amazing Spider-Man #121-122',
          significance: 'Changed the tone of Silver Age comics'
        },
        {
          title: 'Kraven\'s Last Hunt',
          issue: 'Web of Spider-Man #31-32, Amazing Spider-Man #293-294, Spectacular Spider-Man #131-132',
          significance: 'Psychological depth in superhero storytelling'
        }
      ],
      relationships: {
        allies: ['Mary Jane Watson', 'Harry Osborn', 'Aunt May'],
        enemies: ['Green Goblin', 'Doctor Octopus', 'Venom'],
        teams: ['Avengers', 'Fantastic Four (honorary)', 'Future Foundation']
      }
    });

    // Initialize Venom character biography
    this.characterBios.set('venom', {
      id: 'venom',
      name: 'Venom',
      alterEgo: 'Eddie Brock',
      firstAppearance: {
        issue: 'Amazing Spider-Man #300',
        date: '1988-05',
        publisher: 'Marvel Comics',
        era: 'Modern Age',
        creators: ['David Michelinie', 'Todd McFarlane']
      },
      origin: {
        narrative: `The Venom symbiote first appeared as Spider-Man's black costume in Secret Wars #8. After Spider-Man rejected it, the alien bonded with Eddie Brock, a disgraced journalist who blamed Spider-Man for his career's downfall. Together, they became one of Spider-Man's deadliest adversaries before evolving into an anti-hero.`,
        powers: [
          'Shapeshifting',
          'Enhanced strength and durability',
          'Immunity to Spider-Sense',
          'Web-generation'
        ],
        motivation: 'Revenge, later redemption'
      },
      significance: {
        cultural: 'Redefined the concept of anti-heroes in comics',
        industry: 'Spawned numerous spin-off characters and series',
        impact: 'Popularized the symbiote concept in comics'
      },
      keyStorylines: [
        {
          title: 'Lethal Protector',
          issue: 'Venom: Lethal Protector #1-6',
          significance: 'Established Venom as an anti-hero'
        },
        {
          title: 'Maximum Carnage',
          issue: 'Multiple Spider-Man titles',
          significance: 'Defined Venom\'s role as a protector'
        }
      ],
      relationships: {
        allies: ['Spider-Man (sometimes)', 'Flash Thompson', 'Anti-Venom'],
        enemies: ['Carnage', 'Life Foundation', 'Spider-Man (originally)'],
        teams: ['Guardians of the Galaxy', 'Savage Avengers']
      }
    });
  }

  public getCreatorBiography(id: string): CreatorBiography | undefined {
    return this.creatorBios.get(id);
  }

  public getCharacterBiography(id: string): CharacterBiography | undefined {
    return this.characterBios.get(id);
  }

  public getAllCreators(): CreatorBiography[] {
    return Array.from(this.creatorBios.values());
  }

  public getAllCharacters(): CharacterBiography[] {
    return Array.from(this.characterBios.values());
  }

  public searchBiographies(query: string): {
    creators: CreatorBiography[];
    characters: CharacterBiography[];
  } {
    const normalizedQuery = query.toLowerCase();
    
    const creators = Array.from(this.creatorBios.values()).filter(creator =>
      creator.name.toLowerCase().includes(normalizedQuery) ||
      creator.biography.toLowerCase().includes(normalizedQuery)
    );

    const characters = Array.from(this.characterBios.values()).filter(character =>
      character.name.toLowerCase().includes(normalizedQuery) ||
      character.alterEgo.toLowerCase().includes(normalizedQuery) ||
      character.origin.narrative.toLowerCase().includes(normalizedQuery)
    );

    return { creators, characters };
  }
}