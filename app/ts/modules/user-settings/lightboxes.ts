/*
 * Copyright (C) 2014-2017 Andrey Antukh <niwi@niwi.nz>
 * Copyright (C) 2014-2017 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014-2017 David Barragán Merino <bameda@dbarragan.com>
 * Copyright (C) 2014-2017 Alejandro Alonso <alejandro.alonso@kaleidos.net>
 * Copyright (C) 2014-2017 Juan Francisco Alcántara <juanfran.alcantara@kaleidos.net>
 * Copyright (C) 2014-2017 Xavi Julian <xavier.julian@kaleidos.net>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 * File: modules/issues/lightboxes.coffee
 */

import {debounce} from "../../libs/utils"
import * as angular from "angular"

//############################################################################
//# Delete User Lightbox Directive
//############################################################################

export let DeleteUserDirective = function($repo, $rootscope, $auth, $location, $navUrls, lightboxService, $loading) {
    let link = function($scope, $el, $attrs) {
        let submitButton;
        $scope.$on("deletelightbox:new", (ctx, user)=> lightboxService.open($el));

        $scope.$on("$destroy", () => $el.off());

        let submit = function() {
            let currentLoading = $loading()
                .target(submitButton)
                .start();

            let promise = $repo.remove($scope.user);

            promise.then(function(data) {
                currentLoading.finish();
                lightboxService.close($el);
                $auth.logout();
                return $location.path($navUrls.resolve("login"));
            });

            // FIXME: error handling?
            return promise.then(null, function() {
                currentLoading.finish();
                return console.log("FAIL");
            });
        };

        $el.on("click", ".button-green", function(event) {
            event.preventDefault();
            return lightboxService.close($el);
        });

        $el.on("click", ".button-red", debounce(2000, function(event) {
            event.preventDefault();
            return submit();
        })
        );

        return submitButton = $el.find(".button-red");
    };

    return {
        link,
        templateUrl: "user/lightbox/lightbox-delete-account.html"
    };
};
