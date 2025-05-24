```python
from api import ComicVineAPI

def main():
    # Initialize API with your key
    api = ComicVineAPI('1b3c435c0f15af18ab0eb28eceba047583dd5b84')

    try:
        # Search for Spider-Man characters
        print("Searching for Spider-Man characters...")
        characters = api.search_characters('Spider-Man', limit=5)
        for char in characters:
            print(f"- {char['name']}: {char.get('deck', 'No description available')}")

        # Get specific issue details
        print("\nGetting Amazing Spider-Man #300 details...")
        issue = api.get_issue(300)
        print(f"Title: {issue.get('name')}")
        print(f"Cover Date: {issue.get('cover_date')}")

        # Search for issues by creator
        print("\nSearching for Todd McFarlane issues...")
        mcfarlane_issues = api.search_issues(creator='Todd McFarlane', limit=5)
        for issue in mcfarlane_issues:
            print(f"- {issue['volume']['name']} #{issue['issue_number']}")

    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == '__main__':
    main()
```