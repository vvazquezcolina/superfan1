<?php

namespace App\Services;

/**
 * Restaurant Service
 * 
 * Handles restaurant data management and business logic
 */
class RestaurantService
{
    /**
     * Mock restaurant data
     */
    private $restaurants = [
        [
            'id' => 1,
            'name' => 'The Italian Corner',
            'cuisine_type' => 'Italian',
            'location' => 'Downtown',
            'address' => '123 Main St, Downtown',
            'phone' => '+1-555-0123',
            'rating' => 4.5,
            'price_range' => 'moderate',
            'price_symbol' => '$$',
            'description' => 'Authentic Italian cuisine with fresh homemade pasta.',
            'features' => ['outdoor_seating', 'parking', 'wifi'],
            'capacity' => 80,
            'average_meal_duration' => 90
        ],
        [
            'id' => 2,
            'name' => 'Steakhouse Premium',
            'cuisine_type' => 'American',
            'location' => 'Midtown',
            'address' => '456 Oak Ave, Midtown',
            'phone' => '+1-555-0124',
            'rating' => 4.8,
            'price_range' => 'expensive',
            'price_symbol' => '$$$',
            'description' => 'Premium steakhouse featuring dry-aged beef.',
            'features' => ['valet_parking', 'bar', 'private_dining'],
            'capacity' => 120,
            'average_meal_duration' => 120
        ],
        [
            'id' => 3,
            'name' => 'Sushi Zen',
            'cuisine_type' => 'Japanese',
            'location' => 'Uptown',
            'address' => '789 Pine St, Uptown',
            'phone' => '+1-555-0125',
            'rating' => 4.7,
            'price_range' => 'expensive',
            'price_symbol' => '$$$',
            'description' => 'Traditional sushi bar with omakase experience.',
            'features' => ['sushi_bar', 'sake_menu', 'omakase'],
            'capacity' => 45,
            'average_meal_duration' => 105
        ]
    ];

    public function getRestaurants(array $filters, array $pagination, array $sorting): array
    {
        $restaurants = $this->restaurants;
        $restaurants = $this->applyFilters($restaurants, $filters);
        $total = count($restaurants);
        $restaurants = array_slice($restaurants, $pagination['offset'], $pagination['limit']);
        return ['restaurants' => $restaurants, 'total' => $total];
    }

    public function getRestaurantById(int $id): ?array
    {
        foreach ($this->restaurants as $restaurant) {
            if ($restaurant['id'] === $id) {
                return $restaurant;
            }
        }
        return null;
    }

    public function getRestaurantDetails(int $id): array
    {
        return [
            'menu_highlights' => ['Signature Special', 'Chef Recommendation'],
            'amenities' => ['Parking', 'WiFi', 'Accessible'],
            'reviews_summary' => ['total_reviews' => rand(50, 300)]
        ];
    }

    public function searchRestaurants(array $criteria, array $pagination): array
    {
        $restaurants = $this->restaurants;
        if (isset($criteria['location'])) {
            $restaurants = array_filter($restaurants, function($r) use ($criteria) {
                return stripos($r['location'], $criteria['location']) !== false;
            });
        }
        $total = count($restaurants);
        $restaurants = array_slice($restaurants, $pagination['offset'], $pagination['limit']);
        return ['restaurants' => array_values($restaurants), 'total' => $total];
    }

    public function getRestaurantAvailability(int $id, string $date, ?string $time, int $partySize): array
    {
        $slots = ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00'];
        return [
            'available' => true,
            'available_slots' => array_slice($slots, 0, rand(3, 5)),
            'date' => $date,
            'party_size' => $partySize
        ];
    }

    public function getAvailableCuisines(): array
    {
        $cuisines = array_unique(array_column($this->restaurants, 'cuisine_type'));
        return array_map(function($cuisine) {
            return ['name' => $cuisine, 'count' => 1];
        }, $cuisines);
    }

    public function getAvailableLocations(): array
    {
        $locations = array_unique(array_column($this->restaurants, 'location'));
        return array_map(function($location) {
            return ['name' => $location, 'count' => 1];
        }, $locations);
    }

    private function applyFilters(array $restaurants, array $filters): array
    {
        foreach ($filters as $key => $value) {
            if (empty($value)) continue;
            switch ($key) {
                case 'location':
                    $restaurants = array_filter($restaurants, function($r) use ($value) {
                        return stripos($r['location'], $value) !== false;
                    });
                    break;
                case 'cuisine_type':
                    $restaurants = array_filter($restaurants, function($r) use ($value) {
                        return $r['cuisine_type'] === $value;
                    });
                    break;
                case 'search':
                    $restaurants = array_filter($restaurants, function($r) use ($value) {
                        return stripos($r['name'], $value) !== false;
                    });
                    break;
            }
        }
        return array_values($restaurants);
    }
}
