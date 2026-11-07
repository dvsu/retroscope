<?php
declare(strict_types=1);

namespace App\Http;

use App\Models\User;

/** Handles user requests. */
final class UserController extends Controller
{
    private const PER_PAGE = 20;

    public function __construct(private readonly UserRepository $users) {}

    public function show(int $id): ?array
    {
        $user = $this->users->find($id);
        if ($user === null || !$user->active) {
            return null;
        }
        return ['name' => $user->name, 'pages' => self::PER_PAGE, 'admin' => true];
    }
}

echo "Loaded {$_SERVER['REQUEST_URI']}\n";
