import React, { useState } from "react";
import { MinimalLayout } from "../../../components/Layout";
import { ModalView } from "./modal-view";

const longText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris euismod orci vel eleifend posuere. Fusce ut volutpat erat, vitae condimentum turpis. Nunc sed auctor nunc, eget scelerisque tellus. Integer faucibus magna eget massa aliquet, ut pellentesque tellus viverra. In molestie venenatis vulputate. Nulla ipsum nibh, varius sed commodo quis, aliquet at magna. In posuere convallis posuere. Integer finibus lectus mi, vel tincidunt odio vulputate id. Vestibulum arcu lectus, auctor vitae varius sit amet, venenatis ac mauris. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.

Sed ultrices lectus eget ante molestie tincidunt. Fusce ut volutpat quam. Sed in augue ut felis faucibus sagittis. Cras bibendum, magna a commodo dapibus, ipsum nibh laoreet nisi, eu ultrices sem quam quis felis. Pellentesque vel justo dui. Donec eu dictum libero. Donec finibus consequat vulputate. Fusce lobortis sed quam ac lacinia. Maecenas ut consectetur ante. Etiam volutpat in ex pellentesque aliquam. Nam a nulla congue, venenatis enim ac, gravida justo. Morbi ornare dignissim mi ac viverra.

Fusce eget efficitur velit. Sed eu sagittis est. Mauris placerat tincidunt neque sit amet vehicula. Etiam pulvinar erat mauris, ac rutrum leo pharetra ac. Nullam convallis dolor ac gravida accumsan. Sed et sem consectetur, posuere massa ac, maximus odio. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eget egestas orci.

Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam aliquam varius viverra. Maecenas ac bibendum urna. Curabitur aliquam arcu et leo pulvinar, accumsan dapibus diam imperdiet. Aliquam porta turpis nec scelerisque posuere. In mattis aliquam auctor. Curabitur cursus elementum ornare.

Cras in tincidunt massa, quis accumsan augue. Duis vel pharetra arcu. Sed ultricies egestas nisl, a aliquet nulla consectetur eget. Proin ornare lectus luctus, rhoncus nibh vitae, lobortis tortor. Nam feugiat ipsum non nibh fermentum aliquet. Aliquam fermentum varius est eget porttitor. Suspendisse potenti.

Vestibulum fermentum, nulla vitae aliquet condimentum, diam leo feugiat turpis, nec sodales elit odio ut ipsum. Morbi feugiat ex ut rhoncus imperdiet. Pellentesque accumsan felis id velit dignissim, vel tristique ante dictum. Sed nec vestibulum risus, et aliquam tortor. Aliquam tristique mi pulvinar luctus mollis. Quisque id quam sit amet tellus pellentesque aliquet eu feugiat est. Aliquam at posuere urna. Morbi fringilla, purus sit amet hendrerit egestas, sapien est laoreet turpis, vitae maximus ante erat sed quam. Proin malesuada enim est, vel molestie libero lobortis ac. Nullam ut magna eget leo luctus pellentesque nec eu lorem. Sed vel egestas lorem, sed porttitor metus. Sed gravida ipsum at nibh rutrum vehicula. Proin sagittis congue ante eget pharetra.

Sed pellentesque, mi ac placerat ultricies, arcu nisl semper nunc, eu volutpat est tellus a lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed quis massa vitae enim interdum tincidunt. Etiam quis ante felis. Suspendisse ut nunc vel nibh cursus molestie. Cras suscipit, nunc ut sagittis venenatis, urna nibh interdum nunc, sed finibus magna nisi vitae dui. Nunc iaculis semper gravida. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Quisque at tellus turpis. Vestibulum ut eros sed dui vestibulum elementum.

Nam feugiat, urna id congue gravida, ex elit porttitor nibh, ac interdum elit augue sed ante. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed ex ex, euismod sit amet lacinia nec, tristique eu lectus. Fusce sed congue tellus. Maecenas a condimentum urna. Aenean consectetur, orci et viverra pharetra, nulla elit semper nisl, id malesuada nisi quam et massa. Quisque tristique neque tristique pulvinar viverra. Nullam eleifend lacus in efficitur eleifend. In tincidunt in nunc eu pharetra. Aliquam nec ullamcorper neque.

Proin vel nisi vitae nisi maximus scelerisque vitae sit amet odio. Donec sit amet sagittis leo. Pellentesque tempor justo non metus faucibus porttitor. Vivamus eleifend efficitur massa. Sed posuere imperdiet ligula sit amet auctor. Nullam iaculis, mi a blandit pulvinar, dui enim dictum enim, a cursus nulla turpis vel massa. Nam condimentum mauris urna, finibus convallis arcu maximus vitae. Nullam quis tempor dolor. Donec finibus malesuada urna, in malesuada urna malesuada a. Praesent nec vehicula lorem. Fusce finibus est eget arcu facilisis, ut dapibus mi feugiat. Donec dignissim congue lacus, nec aliquet erat porta nec. Maecenas eu velit sit amet nisl ullamcorper sollicitudin. Vivamus in justo id libero iaculis blandit.

Nulla lobortis hendrerit turpis, a aliquam arcu laoreet ac. Fusce ullamcorper nulla eu condimentum condimentum. Vivamus vel augue tincidunt, pharetra nulla non, consequat libero. Donec efficitur risus porta velit pulvinar semper. Aliquam gravida, lacus sed porta egestas, odio quam bibendum ligula, a tempor risus nulla rutrum augue. Sed quis nisl dictum, venenatis dui vel, mollis felis. Sed convallis sed ligula non egestas.

Ut a orci rhoncus, laoreet ipsum quis, bibendum enim. Integer tortor ipsum, vulputate sit amet velit vitae, laoreet euismod metus. Donec nisl arcu, pretium a pellentesque a, eleifend ut sem. Integer non nulla malesuada, mattis quam quis, efficitur magna. Nunc ullamcorper, justo vel efficitur vulputate, libero libero lobortis leo, ultrices tincidunt mi nisl nec odio. Phasellus mauris sem, bibendum non auctor id, venenatis at velit. Aenean id massa accumsan, varius lacus nec, commodo ligula. Sed congue velit eget arcu volutpat, sed euismod dui aliquet. Nunc scelerisque enim vel massa varius interdum lobortis ac mi. Etiam facilisis, sem non euismod commodo, magna orci varius mauris, at aliquam purus ipsum at eros. Vestibulum sagittis ex in tristique mollis. Donec a velit nibh. Nunc convallis tortor facilisis sagittis fermentum. Vestibulum interdum tellus nibh, ut finibus quam elementum a. Aliquam lacinia, velit vitae faucibus pulvinar, eros felis dapibus metus, et malesuada erat nulla sit amet augue. Donec suscipit fermentum pellentesque.

Vestibulum lobortis dolor leo, sit amet lacinia ex viverra vel. Maecenas lacinia nunc in maximus mattis. Maecenas iaculis mauris sed ante dictum, condimentum tristique magna laoreet. Proin in ante non lorem tempus tempus. Phasellus aliquet id lorem eu accumsan. Suspendisse gravida orci non porta facilisis. Vestibulum vulputate consequat nibh ut sollicitudin. Aliquam erat volutpat. Vestibulum accumsan, nulla sed pharetra dignissim, sem purus cursus purus, vel iaculis mi elit in nunc. Etiam rutrum dui arcu, aliquam volutpat metus ultricies et. Donec vulputate fermentum varius.

Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec egestas sagittis enim vel facilisis. Nam euismod eleifend quam, ut varius dolor porta non. Etiam a eros ac dui lobortis porta a non ligula. Maecenas nisi lectus, sagittis ac est quis, ultrices fermentum leo. Morbi ut rutrum risus. Maecenas purus mi, sodales at nisl at, varius ultricies lorem. Maecenas id vehicula massa. Nulla ligula nisi, posuere bibendum nibh eu, vulputate accumsan augue. Proin lobortis iaculis turpis sit amet accumsan. Maecenas quis mattis quam. Nulla facilisi. Praesent leo nisl, interdum nec efficitur rhoncus, aliquet eget urna. Aliquam at lacus neque. Mauris lacinia ultricies aliquam.

Morbi tincidunt suscipit tempus. Donec at egestas velit. Sed eu nisl eu mauris facilisis mollis nec vel mi. Proin vel tristique odio, eu gravida augue. Cras in imperdiet lectus. Sed sit amet diam eu nulla porta lacinia. Vestibulum mollis fermentum molestie. Aenean scelerisque nulla non vulputate varius. Cras sit amet nibh bibendum, finibus elit non, facilisis tortor.

Vestibulum mollis orci ut varius faucibus. Aenean semper nisl id erat faucibus, vel placerat mauris lobortis. Nulla neque velit, venenatis vitae sodales quis, iaculis eget eros. In ac condimentum risus, et aliquet nisl. Donec cursus maximus sem, id iaculis felis tincidunt sit amet. Morbi interdum nunc ac commodo ornare. Aliquam sollicitudin vel nisi ut imperdiet.`;

const shortText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris euismod orci vel eleifend posuere. Fusce ut volutpat erat, vitae condimentum turpis. Nunc sed auctor nunc, eget scelerisque tellus. Integer faucibus magna eget massa aliquet, ut pellentesque tellus viverra. In molestie venenatis vulputate. Nulla ipsum nibh, varius sed commodo quis, aliquet at magna. In posuere convallis posuere. Integer finibus lectus mi, vel tincidunt odio vulputate id. Vestibulum arcu lectus, auctor vitae varius sit amet, venenatis ac mauris. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.`;

export const ModalPage = () => {
  const [isOpenSmallModal, setOpenSmallModal] = useState(false);
  const [isOpenMediumModal, setOpenMediumModal] = useState(false);
  const [isOpenFullModal, setOpenFullModal] = useState(false);
  const [isLongText, setIsLongText] = useState(false);

  const toggleText = () => {
    setIsLongText((prevState) => !prevState);
  };

  const toggleSmallModal = () => {
    setOpenSmallModal((value) => !value);
  };
  const toggleMediumModal = () => {
    setOpenMediumModal((value) => !value);
  };
  const toggleFullModal = () => {
    setOpenFullModal((value) => !value);
  };

  return (
    <MinimalLayout>
      <ModalView
        isOpenSmallModal={isOpenSmallModal}
        isOpenMediumModal={isOpenMediumModal}
        isOpenFullModal={isOpenFullModal}
        toggleSmallModal={toggleSmallModal}
        toggleMediumModal={toggleMediumModal}
        toggleFullModal={toggleFullModal}
        toggleText={toggleText}
        text={isLongText ? longText : shortText}
      />
    </MinimalLayout>
  );
};
