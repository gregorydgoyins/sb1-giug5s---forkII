```python
import time
import urllib.parse
import requests
from typing import Dict, List, Optional, Union

class ComicVineAPI:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://comicvine.gamespot.com/api"
        self.headers = {
            "User-Agent": "Panel Profits/1.0 (Comic Analysis Platform)"
        }
        self.rate_limit_remaining = 100
        self.last_request_time = 0
        self.min_request_interval = 1  # 1 second between requests

    def _make_request(self, endpoint: str, params: Dict) -> Dict:
        """Make a rate-limited API request"""
        # Respect rate limiting
        current_time = time.time()
        if current_time - self.last_request_time < self.min_request_interval:
            time.sleep(self.min_request_interval - (current_time - self.last_request_time))

        # Add required parameters
        params.update({
            'api_key': self.api_key,
            'format': 'json'
        })

        # Build URL with proper encoding
        url = f"{self.base_url}/{endpoint}"
        encoded_params = urllib.parse.urlencode(params)
        full_url = f"{url}?{encoded_params}"

        try:
            response = requests.get(full_url, headers=self.headers)
            response.raise_for_status()
            self.last_request_time = time.time()
            
            data = response.json()
            if data.get('error') == 'Invalid API Key':
                raise ValueError("Invalid Comic Vine API key")

            return data

        except requests.exceptions.RequestException as e:
            raise Exception(f"API request failed: {str(e)}")

    def search_characters(self, query: str, limit: int = 10) -> List[Dict]:
        """Search for characters"""
        params = {
            'query': query,
            'resources': 'character',
            'limit': min(limit, 100),
            'field_list': 'id,name,deck,image,publisher,first_appeared_in_issue'
        }
        
        response = self._make_request('search', params)
        return response.get('results', [])

    def get_issue(self, issue_id: int) -> Dict:
        """Get detailed issue information"""
        params = {
            'field_list': 'id,name,issue_number,volume,cover_date,description,character_credits,person_credits'
        }
        
        response = self._make_request(f'issue/4000-{issue_id}', params)
        return response.get('results', {})

    def get_volume(self, volume_id: int) -> Dict:
        """Get volume information"""
        params = {
            'field_list': 'id,name,publisher,start_year,end_year,count_of_issues'
        }
        
        response = self._make_request(f'volume/4050-{volume_id}', params)
        return response.get('results', {})

    def get_publisher(self, publisher_id: int) -> Dict:
        """Get publisher information"""
        params = {
            'field_list': 'id,name,deck,description,characters,volumes'
        }
        
        response = self._make_request(f'publisher/4010-{publisher_id}', params)
        return response.get('results', {})

    def search_issues(
        self,
        query: Optional[str] = None,
        publisher: Optional[str] = None,
        creator: Optional[str] = None,
        release_date: Optional[str] = None,
        limit: int = 10
    ) -> List[Dict]:
        """Search for issues with multiple filters"""
        params = {
            'limit': min(limit, 100),
            'field_list': 'id,name,issue_number,volume,cover_date,person_credits'
        }

        if query:
            params['filter'] = f'name:{query}'
        if publisher:
            params['filter'] = f'publisher:{publisher}'
        if creator:
            params['filter'] = f'person_credits:{creator}'
        if release_date:
            params['filter'] = f'cover_date:{release_date}'

        response = self._make_request('issues', params)
        return response.get('results', [])

    def get_creator(self, creator_id: int) -> Dict:
        """Get detailed creator information"""
        params = {
            'field_list': 'id,name,deck,description,created,issues'
        }
        
        response = self._make_request(f'person/4040-{creator_id}', params)
        return response.get('results', {})

    def validate_response(self, response: Dict) -> bool:
        """Validate API response"""
        if not response:
            return False
        if response.get('error', 'OK') != 'OK':
            return False
        if 'results' not in response:
            return False
        return True

    def format_response(self, data: Dict, include_fields: List[str]) -> Dict:
        """Format and filter response data"""
        if not data or not isinstance(data, dict):
            return {}

        return {
            field: data.get(field)
            for field in include_fields
            if field in data
        }
```